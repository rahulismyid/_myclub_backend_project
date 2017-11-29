var settings = require("../settings");

exports.show500 = function (req, resp, err) {
    if (settings.httpMsgsFormat === "HTML") {
        resp.writeHead(500, "Internal Error Occurred", { "Content-Type": "text/html" });
        resp.write("<html><head><title>500</title></head><body>500: Error. Details:" + err + " </body> </html>");
    }
    else {
        resp.writeHead(500, "Internal Error Occurred", { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "Error Occurred: " + err }));
    }
    resp.end();
};

exports.sendJSON = function (req, resp, data) {
    resp.writeHead(200, { 'Content-Type': 'application/JSON' });
    if (data) {
        resp.write(JSON.stringify(data));
    }
    resp.end();
};

exports.show405 = function (req, resp) {
    if (settings.httpMsgsFormat === "HTML") {
        resp.writeHead(405, "Method not supported", { "Content-Type": "text/html" });
        resp.write("<html><head><title>405</title></head><body>405: Method not supported. </body> </html>");
    }
    else {
        resp.writeHead(405, "Method not supported.", { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "Method not supported." }));
    }
    resp.end();

};

exports.show204 = function (req, resp) {
    if (settings.httpMsgsFormat === "HTML") {
        resp.writeHead(404, "No Content found.", { "Content-Type": "text/html" });
        resp.write("<html><head><title>404</title></head><body>404: Resource not found. </body> </html>");
    }
    else {
        resp.writeHead(404, "No Content found.", { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "Resource not found." }));
    }
    resp.end();
};

exports.show403 = function (req, resp) {
    if (settings.httpMsgsFormat === "HTML") {
        resp.writeHead(403, "Resource not found.", { "Content-Type": "text/html" });
        resp.write("<html><head><title>404</title></head><body>403: Forbidden: You don't have permission to access [directory] on this server.</body> </html>");
    }
    else {
        resp.writeHead(403, "Resource not found.", { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "403: Forbidden: You don't have permission to access [directory] on this server." }));
    }
    resp.end();
};

exports.show404 = function (req, resp) {
    if (settings.httpMsgsFormat === "HTML") {
        resp.writeHead(404, "Resource not found.", { "Content-Type": "text/html" });
        resp.write("<html><head><title>404</title></head><body>404: Resource not found. </body> </html>");
    }
    else {
        resp.writeHead(404, "Resource not found.", { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "Resource not found." }));
    }
    resp.end();
};

exports.show413 = function (req, resp) {
    if (settings.httpMsgsFormat === "HTML") {
        resp.writeHead(413, "Request entity too large.", { "Content-Type": "text/html" });
        resp.write("<html><head><title>413</title></head><body>413: Request entity too large.</body> </html>");
    }
    else {
        resp.writeHead(413, "Request entity too large.", { "Content-Type": "application/json" });
        resp.write(JSON.stringify({ data: "Request entity too large." }));
    }
    resp.end();
};

exports.send200 = function (req, resp) {
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.end();
};

exports.sendHome = function (req, resp) {
    if (settings.httpMsgsFormat === "HTML") {
        resp.writeHead(200, { "Content-Type": "text/html" });
        resp.end("<html><head><title>HOME</title></head><body>Valid End Points: <br> /employees - GET - To List all employees. <br>/employees/empno - GET - To seach ann employee with 'empno'. </body> </html>");
    }
    else {
        resp.writeHead(200, { "Content-Type": "application/json" });
        resp.write(JSON.stringify([
            { url: "/employees", operation: "GET", description: "To List all employees." },
            { url: "/employees/<empNo>", operation: "GET", description: "To search an employee." }
        ]));
    }
    resp.end();
};