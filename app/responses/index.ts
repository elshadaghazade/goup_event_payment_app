import { NextResponse } from "next/server";
import { HttpResponseParams } from "@/app/interfaces/Http";
import { ClientError } from "@/app/interfaces/ClientError";

export function createHttpErrorResponse(err: any, additionalParams?: HttpResponseParams) {
  // Ensure there is a default error message
  let errorMessage = 'An unexpected error occurred';
  if (err?.meta?.cause) {
    errorMessage = 'SOMETHING_WENT_WRONG';
  } else if (typeof err === 'string') {
    errorMessage = err;
  } else {
    errorMessage = err.details as string || err.message as string || 'An unexpected error occurred';
  }

  // Check if the error code is a valid HTTP status code
  let status = 500;
  if (err instanceof ClientError) {
    status = err.statusCode;
  } else if (typeof err !== 'string' && err.code >= 200 && err.code <= 599) {
    status = err.code;
  };

  return NextResponse.json(
    {
      error: errorMessage,
      data: null,
    },
    {
      status: additionalParams?.statusCode || status,
      headers: additionalParams?.headers
    }
  );
}

export function createHttpResponse(data: any, additionalParams?: HttpResponseParams) {
  return NextResponse.json(
    {
      error: null,
      data,
    },
    {
      headers: additionalParams?.headers,
      status: additionalParams?.statusCode
    }
  );
}
