
const bcrypt = require("bcrypt");
(async function () {
    const string = "admin@taskflow"
    const secret="123"
    const hashedStr = await bcrypt.hash(string,10)
    console.log("hash",hashedStr)
    const comparison = await bcrypt.compare(string,"$2b$10$vYH688qxX3hXjs3cFV01au.yZvnmoV/nSoZY8cOavLGK8lczSzIVG")
    console.log(comparison)
})();