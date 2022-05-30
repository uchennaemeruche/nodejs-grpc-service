const grpcProtoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')
const { v4: uuidv4 } = require("uuid");

const PROTO_PATH = "./company.proto"

const opts = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

const packageDefinition = grpcProtoLoader.loadSync(PROTO_PATH, opts)
const newsProto = grpc.loadPackageDefinition(packageDefinition)

const server = new grpc.Server()

const companies = [{
        id: "1",
        name: "Dell",
        sector: "IT",
        category: "",
        is_startup: false,
        ceo: "Michael Dell",
        revenue: "92.2 billion",
    },
    {
        id: "2",
        name: "Netflix",
        sector: "IT",
        category: "",
        is_startup: false,
        ceo: "Reed Hastings",
        revenue: "20.2 billion",
    },
    {
        id: "3",
        name: "Microsoft",
        sector: "IT",
        category: "",
        is_startup: false,
        ceo: "Satya Nadella",
        revenue: "320 million",
    }
];



server.addService(newsProto.CompanyService.service, {
    getAllCompanies: (_, callback) => {
        callback(null, { companies })
    },
    getCompany: (_, callback) => {
        const companyId = _.request.id;
        const company = companies.find(({ id }) => id == companyId);
        callback(null, company)

    },
    addCompany: (req, callback) => {
        const _company = { id: uuidv4(), ...req.request };
        companies.push(_company)
        callback(null, _company)
    },
    deleteCompany: (_, callback) => {
        const companyId = _.request.id;
        companies = companies.filter(({ id }) => id !== companyId)
        callback(null, {})
    },
    updateCompany: (_, callback) => {
        const companyId = _.request.id;
        const company = companies.find(({ id }) => id == companyId)
        company.name = _.request.name
        company.sector = _.request.sector
        company.category = _.request.category
        company.is_startup = _.request.is_startup
        company.revenue = _.request.revenue

        callback(null, company)
    }

})

server.bindAsync("127.0.0.1:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
    console.log("Server is running on port:", port)
    server.start()
});