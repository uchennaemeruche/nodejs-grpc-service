const app = require("express")()

const client = require("../client")
const PORT = 5000,
    HOST = "localhost"


app.get("/companies", (req, res) => {
    client.getAllCompanies({}, (error, companies) => {
        console.log("Calling all companies");
        if (error) throw error;
        res.json(companies)
    });
})

app.get("/companies/:id", (req, res) => {
    client.getCompany({ id: req.params.id }, (error, company) => {
        if (error) throw error;
        res.json(company);
    });
})


app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});