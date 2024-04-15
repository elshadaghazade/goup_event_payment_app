import { NextRequest, NextResponse } from "next/server"

import { HttpError } from "@/app/errors/HttpError"
import { createHttpErrorResponse, createHttpResponse } from "@/app/responses"
import { ClientError } from "../interfaces/ClientError";

const requestCountByIp = new Map<
  string,
  { count: number; lastRequestTime: number; timeWindow: number }
>();

const maxRequests = process.env.REQUESTS_RATE_LIMIT
  ? parseInt(process.env.REQUESTS_RATE_LIMIT)
  : 1;

const timeWindow = process.env.REQUESTS_RATE_LIMIT_TIME_WINDOW
  ? parseInt(process.env.REQUESTS_RATE_LIMIT_TIME_WINDOW)
  : 3000;


function getHashCode (request: NextRequest) {
  const ip = request.ip || request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for");

  if (!ip) {
    throw new Error("IP_IS_WRONG");
  }

  const url = request.url;

  const token = request.headers.get('Authorization') || "";

  return Buffer.from(ip + url + token).toString('base64');
}

export async function RequestsRateLimit(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Update this as per your CORS policy
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }

  let hashCode = "";

  try {
    hashCode = getHashCode(request);
  } catch {
    return createHttpErrorResponse(new ClientError("BAD_REQUEST", 400), {
      headers: {
        'Access-Control-Allow-Origin': '*', // Update this as per your CORS policy
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }

  if (!hashCode) {
    return createHttpErrorResponse(new ClientError("BAD_REQUEST", 400), {
      headers: {
        'Access-Control-Allow-Origin': '*', // Update this as per your CORS policy
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }

  if (!requestCountByIp.has(hashCode)) {
    requestCountByIp.set(hashCode, {
      count: maxRequests,
      lastRequestTime: Date.now(),
      timeWindow,
    })
  } else {
    const requestData = requestCountByIp.get(hashCode)!
    if (Date.now() - requestData.lastRequestTime >= requestData.timeWindow) {
      requestData.count = maxRequests
      requestData.lastRequestTime = Date.now()
      requestData.timeWindow = timeWindow
    } else if (requestData.count <= 0) {
      requestData.lastRequestTime = Date.now()
      if (requestData.timeWindow < 30000) {
        requestData.timeWindow += 100
      }

      return createHttpErrorResponse(new ClientError("TOO_MANY_REQUESTS", 429), {
        headers: {
          'Access-Control-Allow-Origin': '*', // Update this as per your CORS policy
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    } else {
      requestData.count--
    }
  }

  return NextResponse.next({
    headers: {
      'Access-Control-Allow-Origin': '*', // Update this as per your CORS policy
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}

const clearExpiredRequestRecord = () => {
  if (!requestCountByIp.size) {
    return;
  }

  for(let [key, value] of requestCountByIp.entries()) {
    if (Date.now() - value.lastRequestTime >= value.timeWindow * 2) {
      requestCountByIp.delete(key);
    }
  }
}

setInterval(clearExpiredRequestRecord, Number(process.env.CLEAR_REQUEST_RECORDS_TIME_DELAY || 60000));