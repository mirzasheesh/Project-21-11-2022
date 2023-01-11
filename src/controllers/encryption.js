const bcrypt = require('bcrypt');

const encrypt = (password) => {

    let salt = bcrypt.genSaltSync();
    
    let hashedString = bcrypt.hashSync(password, salt);
    
    return hashedString;
}

const decrypt = (password, hashedString) => bcrypt.compareSync(password, hashedString);

module.exports = {encrypt, decrypt};