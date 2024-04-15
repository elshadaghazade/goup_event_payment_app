const { 
    PrismaClient, 
    User, 
    Prisma,
    Patient,
    Country,
    EmailVerificationToken,
    user_type_enum
} = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const countries = require('./countries+states+cities.json');
const countriesNew = require('./countries_states_cities_prisma.json');
const services = require('./services_and_categories.json');
const educationDegree = require('./education_degree.json');
const cars = require('./cars.json');
const fs = require('fs');


const prisma = new PrismaClient({
    log: [
        {
            emit: "event",
            level: "query"
        }
    ]
});

prisma.$on("query", async (e) => {
    console.log(`${e.query} ${e.params}`)
});


async function main () {
    prisma.$transaction(async (tx) => {
        await seedLocationFromJSON(tx);
        await seedLanguages(tx);
        await seedAcceptances(tx);
        await seedServices(tx);
        await seedHealthcareFacilityTypes(tx);
        await seedEducationDegree(tx);
        await seedCars(tx);
        await seedUsers(tx);
        await seedContactTypes(tx);
    }, {
        maxWait: 9999999999000,
        timeout: 9999999999000
    });
}

async function seedPatients () {
    const AMOUNT_OF_USERS = 1000;
    const users = [];

    for (let i = 0; i < AMOUNT_OF_USERS; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const country = await prisma.$queryRaw`select * from "Country" order by random() limit 1`;
        const countryId = country[0].id;

        const email = faker.internet.email({
            firstName,
            lastName
        });
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('Lappin555', salt);

        const user = await prisma.user.create({
            data: {
                email,
                password,
                created_at: new Date(),
                Patient: {
                    create: {
                        first_name: firstName,
                        last_name: lastName,
                        country_id: countryId,
                        created_at: new Date()
                    }
                }
            },
            include: {
                Patient: true
            }
        });

        console.log(user);
    }
}

async function seedLocationFromJSON (tx) {

    await tx.countryTimeZone.deleteMany({
        where: {}
    });

    await tx.city.deleteMany({
        where: {}
    });

    await tx.state.deleteMany({
        where: {}
    });

    await tx.acceptances.deleteMany({
        where: {}
    });

    await tx.country.deleteMany({
        where: {}
    });
    
    for(let country of countriesNew) {
        

        try {

            if (country.currency?.trim()) {
                let currency = await tx.currency.findFirst({
                    where: {
                        currency: country.currency
                    },
                    select: {
                        id: true
                    }
                });

                if (!currency) {
                    currency = await tx.currency.create({
                        data: {
                            currency: country.currency,
                            currency_name: country.currency_name,
                            currency_symbol: country.currency_symbol,
                            is_active: ['AZN', 'TRY', 'USD', 'EUR', 'RUB'].includes(country.currency?.trim()?.toUpperCase())
                        }
                    });
                }

                // delete country.currency;
                delete country.currency_name;
                delete country.currency_symbol;
                // country.currency_id = currency.id;
            }

            const result = await tx.country.create({
                data: country
            });

            console.log(result);
            console.log("===================");
        } catch(err) {
            console.log(JSON.stringify(country, null, 4));
            console.error("Error:", err);
            break;
        }
    }

    await tx.$queryRaw`update "City" as t1 set country_id = (select id from "Country" as t2 where t2.numeric_code = t1.country_code)`;

}

async function seedAcceptances (tx) {
    const lang = await tx.language.findFirst({
        where: {
            short: 'TR'
        }
    });

    if (!lang) {
        throw new Error("LANGUAGE_NOT_FOUND");
    }

    const country = await tx.country.findFirst({
        where: {
            iso2: 'TR'
        }
    });

    if (!country) {
        throw new Error("COUNTRY_NOT_FOUND");
    }

    await tx.acceptances.deleteMany({
        where: {}
    });

    await tx.acceptances.createMany({
        data: [
            {
                user_type: user_type_enum.healthcare_facility,
                type: 'Rules & Policies',
                title: "Kullanım Koşulları ve Gizlilik Politikası",
                country_id: country.id,
                lang_code: lang.short.trim(),
                content: 'Klinikler için kullanım koşullarının içeriği',
                effective_date: new Date('2023-11-1'),
                created_at: new Date()
            },
            {
                user_type: user_type_enum.doctor,
                type: 'Rules & Policies',
                title: "Kullanım Koşulları ve Gizlilik Politikası",
                country_id: country.id,
                lang_code: lang.short.trim(),
                content: 'Doktorlar için kullanım koşullarının içeriği',
                effective_date: new Date('2023-11-1'),
                created_at: new Date()
            },
            {
                user_type: user_type_enum.patient,
                type: 'Rules & Policies',
                title: "Kullanım Koşulları ve Gizlilik Politikası",
                country_id: country.id,
                lang_code: lang.short.trim(),
                content: 'Hastalar için kullanım koşullarının içeriği',
                effective_date: new Date('2023-11-1'),
                created_at: new Date()
            },
            {
                user_type: user_type_enum.healthcare_facility,
                type: 'Privacy Policy',
                title: "Gizlilik",
                country_id: country.id,
                lang_code: lang.short.trim(),
                content: 'Klinikler için Kişisel Verileri Koruma Kurumu (KVKK), Genel Veri Koruma Tüzüğü (GDPR) ve başka terms ve policy',
                effective_date: new Date('2023-11-1'),
                created_at: new Date()
            },
            {

                user_type: user_type_enum.doctor,
                type: 'Privacy Policy',
                title: "Gizlilik",
                country_id: country.id,
                lang_code: lang.short.trim(),
                content: 'Doktorlar için Kişisel Verileri Koruma Kurumu (KVKK), Genel Veri Koruma Tüzüğü (GDPR) ve başka terms ve policy',
                effective_date: new Date('2023-11-1'),
                created_at: new Date()
            },
            {
                user_type: user_type_enum.patient,
                type: 'Privacy Policy',
                title: "Gizlilik",
                country_id: country.id,
                lang_code: lang.short.trim(),
                content: 'Hastalar için Kişisel Verileri Koruma Kurumu (KVKK), Genel Veri Koruma Tüzüğü (GDPR) ve başka terms ve policy',
                effective_date: new Date('2023-11-1'),
                created_at: new Date()
            },
            
        ]
    });
}

async function seedLanguages (tx) {
    await tx.service.deleteMany({
        where: {}
    });

    await tx.specialty.deleteMany({
        where: {}
    });

    await tx.acceptances.deleteMany({
        where: {}
    });

    await tx.language.deleteMany({
        where: {}
    });

    await tx.language.createMany({
        data: [
            {
                name: 'English',
                short: 'EN',
                is_active: true,
                is_default: true,
                created_at: new Date()
            },
            {
                name: 'Azerbaijani',
                short: 'AZ',
                is_active: true,
                is_default: false,
                created_at: new Date()
            },
            {
                name: 'Turkish',
                short: 'TR',
                is_active: true,
                is_default: false,
                created_at: new Date()
            },
            {
                name: 'Russian',
                short: 'RU',
                is_active: true,
                is_default: false,
                created_at: new Date()
            },
        ]
    });

    console.log("languages done");
}

async function seedServices (tx) {

    const lang = await tx.language.findFirst({
        where: {
            short: 'TR'
        },
        select: {
            id: true,
            short: true
        }
    });

    if (!lang) {
        throw new Error("LANGUAGE_NOT_FOUND");
    }

    await tx.specialty.deleteMany({
        where: {}
    });

    await tx.service.deleteMany({
        where: {}
    });

    for(let i in services) {
        i = parseInt(i);
        const service = services[i];
        const category = await tx.specialty.create({
            data: {
                title: service.category,
                weight: i,
                is_active: true,
                created_at: new Date()
            }
        });

        await tx.specialtyTranslation.create({
            data: {
                title: service.category,
                lang_code: lang.short.trim(),
                specialty_id: category.id
            }
        });

        for(let i in service.services) {
            i = parseInt(i);
            const title = service.services[i];

            console.log("service:", title, category.title);

            const s = await tx.service.create({
                data: {
                    specialty_id: category.id,
                    title,
                    weight: i,
                    is_active: true,
                    created_at: new Date()
                }
            });

            await tx.serviceTranslation.create({
                data: {
                    service_id: s.id,
                    lang_code: lang.short.trim(),
                    title
                }
            })
        }
    }
}

async function seedHealthcareFacilityTypes (tx) {
    await tx.healthcareFacilityType.createMany({
        data: [
            {
                name: 'Hospital',
                description: 'A large facility providing a wide range of healthcare services, including emergency services, surgery, and inpatient care'
            },
            {
                name: 'Clinic',
                description: 'A smaller facility offering outpatient services, often specialized in a particular type of care'
            },
            {
                name: 'Specialized Center',
                description: 'A facility focused on a specific type of healthcare, such as a cancer center, cardiac center, or maternity center'
            },
            {
                name: 'Primary Care Facility',
                description: 'Offers general medical care to a wide range of patients, often the first point of contact for patients'
            },
            {
                name: 'Diagnostic Center',
                description: 'Provides diagnostic services like imaging (X-rays, MRI) and laboratory tests'
            },
            {
                name: 'Surgical Center',
                description: 'Specializes in outpatient surgery that doesn’t require hospital admission'
            },
            {
                name: 'Rehabilitation Center',
                description: 'Offers services for physical, occupational, and speech therapy'
            },
            {
                name: 'Long-term Care Facility',
                description: 'Provides extended care and living facilities for patients with chronic illnesses or disabilities, including nursing homes and assisted living facilities'
            },
            {
                name: 'Emergency Care Facility',
                description: 'Specializes in emergency medical services and urgent care'
            },
            {
                name: 'Mental Health Center',
                description: 'Focuses on the treatment and support of mental health issues'
            },
            {
                name: 'Research Institute',
                description: 'Conducts medical research and trials, often associated with advancements in medical science and treatments'
            },
            {
                name: 'Telehealth Service Provider',
                description: 'Offers medical consultations and services through telecommunications technology, often virtual clinics'
            },
        ]
    });
}

async function seedEducationDegree (tx) {
    const languages = await tx.language.findMany({
        where: {}
    });

    for (let degree of educationDegree) {
        const d = await tx.educationDegree.create({
            data: {
                title: degree.title.trim(),
                education_type: degree.education_type.trim(),
            }
        });

        for(let lang of languages) {
            await tx.educationDegreeTranslation.create({
                data: {
                    education_degree_id: d.id,
                    lang_code: lang.short.trim(),
                    title: degree.title.trim(),
                }
            })
        }
    }
}

async function seedCars(tx) {
    for (const car of cars) {
        // Check if the manufacturer already exists
        let manufacturer = await tx.carManufacturer.findUnique({
            where: { name: car.marka.trim() },
        });

        // If the manufacturer doesn't exist, create it
        if (!manufacturer) {
            manufacturer = await tx.carManufacturer.create({
                data: { name: car.marka.trim() },
            });
        }

        const model = await tx.carModel.findFirst({
            where: {
                car_manufacturer_id: manufacturer.id,
                name: car.model.trim()
            }
        });

        if (!model) {
            await tx.carModel.create({
                data: {
                    name: car.model.trim(),
                    car_manufacturer_id: manufacturer.id,
                    // Assuming 'value' should be stored somewhere in CarModel, add it if needed
                    // value: car.value,
                },
            });
        }
    }
}

async function seedUsers(tx) {
    // Seed users and their related records
    let doctorCount = clinicCount = patientCount = 0;
    for (let i = 0; i < 5; i++) {
        // Create a user for each type
        const userTypes = ['patient', 'doctor', 'healthcare_facility'];
        for (const userType of userTypes) {
            let email, phone;

            if (userType === 'doctor') {
                email = `doctor${++doctorCount}@gmail.com`;
            } else if (userType === 'healthcare_facility') {
                email = `clinic${++clinicCount}@gmail.com`;
            } else if (userType === 'patient') {
                phone = `+${++patientCount}`;
            }

            const userData = {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: userType === 'doctor' || userType === 'healthcare_facility' ? email : null,
                phone: userType === 'patient' ? phone : null,
                password: bcrypt.hashSync('password', 10), // Use a hashed password
                user_type: userType,
                country_id: 228, // Assuming country with ID 228 exists
                verified_at: new Date(),
                created_at: new Date(),
                modified_at: new Date(),
            };

            const user = await tx.user.create({ data: userData });

            switch (userType) {
                case 'patient':
                    await tx.patient.create({
                        data: {
                            user_id: user.id,
                            profile_photo: faker.image.avatar(),
                            birthdate: faker.date.past(),
                            occupation: faker.word.noun({length: 20}),
                            weight: Math.floor(Math.random() * (120 - 50) + 50),
                            whatsapp: faker.phone.number(),
                            created_at: new Date(),
                            modified_at: new Date(),
                        },
                    });
                    break;
                case 'doctor':
                    await tx.doctor.create({
                        data: {
                            user_id: user.id,
                            profile_photo: faker.image.avatar(),
                            created_at: new Date(),
                            modified_at: new Date(),
                        },
                    });
                    break;
                case 'healthcare_facility':
                    await tx.healthcareFacility.create({
                        data: {
                            user_id: user.id,
                            title: faker.company.name(),
                            type_id: 1, // Assuming a valid type_id
                            created_at: new Date(),
                            modified_at: new Date(),
                        },
                    });
                    break;
            }
        }
    }

    console.log('Seeding completed.');
}

async function seedContactTypes (tx) {
    const t = await tx.contactType.create({
        data: {
                name: 'Facebook',
                type: 'url',
                created_at: new Date()
            }
    });

    await tx.contactTypeTranslation.create({
        data: {
            contact_type_id: t.id,
            lang_code: 'TR',
            name: 'Facebook'
        }
    });
}

main();