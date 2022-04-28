// Connect DB
// const { connect } = require("./index");

// const config = {
//   user: '',
//   host: 'localhost',
//   database: 'norm-pg-test',
//   password: '',
//   port: 5432,
// };

// const db = connect(config);

// db.getSchema().then(console.log).catch(console.log);

// db.define(
//   `person_name: customer -> string`,
//   `birth_year: customer -> integer`,
//   `city: customer -> string`,
//   `national_id: customer -> string unique`
// ).then(console.log).catch(console.log);

// db.define(`number: card -> integer unique`, `credit_limit: card -> integer`, `rate: card -> integer`, `expire: card -> date`, `holder: card -> customer`,).then(console.log).catch(console.log);

// db.define(
//  `campaign_name: campaign -> string unique`,
//  `duration: campaign -> string`
//  ).then(console.log).catch(console.log);

// db.define(`_by_ * _in_ : participation -> customer * campaign`).then(console.log).catch(console.log);

// db.add('customer').set(
//   `person_name = 'John'`,
//   `birth_year = 1980`,
//   `city = 'New York'`,
//   `national_id = '123456789'`
// ).then(console.log).catch(console.log);


// db.where(`card => number => filter(= 1110)`).get(`card => holder => city`, `card => number`, `card => expire` ).then(console.log).catch(console.log);

// db.add(`customer`).set(
//   `person_name = 'Missy'`,
//   `birth_year = 1981`,
//   `city = 'Los Angeles'`,
//   `national_id = '10000003'`
// ).then(console.log).catch(console.log);

// db.add(`customer`).set(
//   `person_name = 'Jane'`,
//   `birth_year = 1982`,
//   `city = 'Los Angeles'`,
//   `national_id = '10000004'`
// ).then(console.log).catch(console.log);

// db.add(`customer`).set(
//   `person_name = 'Dave'`,
//   `birth_year = 1983`,
//   `city = 'Boston'`,
//   `national_id = '10000005'`
// ).then(console.log).catch(console.log);

// db.add(`customer`).set(
//   `person_name = 'Kevin'`,
//   `birth_year = 1994`,
//   `city = 'New York'`,
//   `national_id = '10000006'`
// ).then(console.log).catch(console.log);

// db.add(`customer`).set(
//   `person_name = 'Mike'`,
//   `birth_year = 1995`,
//   `city = 'New York'`,
//   `national_id = '10000007'`
// ).then(console.log).catch(console.log);

// db.add(`customer`).set(
//   `person_name = 'Carol'`,
//   `birth_year = 2000`,
//   `city = 'Boston'`,
//   `national_id = '10000008'`
// ).then(console.log).catch(console.log);

// db.add('card').set(
//   `number = 1110`,
//   `credit_limit = 1000`,
//   `rate = 10`,
//   `expire = '2020-01-01'`,
//   `holder = 1`
// ).then(console.log).catch(console.log);


// db.add('card').set(
//   `number = 1111`,
//   `credit_limit = 2000`,
//   `rate = 10`,
//   `expire = '2023-05-01'`,
//   `holder = 1`
// ).then(console.log).catch(console.log);

// db.add('card').set(
//   `number = 1112`,
//   `credit_limit = 2200`,
//   `rate = 13`,
//   `expire = '2024-05-01'`,
//   `holder = 2`
// ).then(console.log).catch(console.log);

// db.add('card').set(
//   `number = 1113`,
//   `credit_limit = 1800`,
//   `rate = 13`,
//   `expire = '2026-05-01'`,
//   `holder = 3`
// ).then(console.log).catch(console.log);

// db.add('card').set(
//   `number = 1114`,
//   `credit_limit = 2000`,
//   `rate = 15`,
//   `expire = '2027-05-01'`,
//   `holder = 4`
// ).then(console.log).catch(console.log);

// db.add('card').set(
//   `number = 1115`,
//   `credit_limit = 2000`,
//   `rate = 15`,
//   `expire = '2028-05-01'`,
//   `holder = 5`
// ).then(console.log).catch(console.log);

// db.add('card').set(
//   `number = 1116`,
//   `credit_limit = 5000`,
//   `rate = 15`,
//   `expire = '2025-05-01'`,
//   `holder = 6`
// ).then(console.log).catch(console.log);

// db.add('card').set(
//   `number = 1117`,
//   `credit_limit = 4000`,
//   `rate = 10`,
//   `expire = '2026-11-01'`,
//   `holder = 5`
// ).then(console.log).catch(console.log);

// db.add(`card`).set(
//   `number = 1118`,
//   `credit_limit = 4000`,
//   `rate = 10`,
//   `expire = '2026-11-01'`,
//   `holder = 7`
// ).then(console.log).catch(console.log);

// db.where(`card`).get(`card => holder => person_name`).then(console.log).catch(console.log);

// db.where(`customer => inv(holder) => reduce(count) => filter( > 1)`).get(`customer => person_name`).then(console.log).catch(console.log);

// db.where(`customer => city => filter(= 'New York')`).get(`customer => inv(holder) => rate => reduce(avg) => map(round)`).then(console.log).catch(console.log);

// db.where(`customer => filter(= 8)`).delete('customer').then(console.log).catch(console.log);

// db.add('campaign').set(`campaign_name = 'Hot Shot'`, `duration = 'seasonal'`).then(console.log).catch(console.log);

// db.add('campaign').set(`campaign_name = 'Love Dove'`, `duration = 'monthly'`).then(console.log).catch(console.log);

// db.add(`campaign`).set(`campaign_name = 'Aloha'`, `duration = 'seasonal'`).then(console.log).catch(console.log);

// db.add(`participation`).set(`_by_ = 1`, `_in_ = 1`).then(console.log).catch(console.log);

// db.add(`participation`).set(`_by_ = 3`, `_in_ = 1`).then(console.log).catch(console.log);

// db.add(`participation`).set(`_by_ = 4`, `_in_ = 2`).then(console.log).catch(console.log);

// db.where(`campaign => duration => filter(= 'seasonal')`).get(`campaign => inv(_in_) => _by_ => inv(holder) => credit_limit => reduce(sum) => reduce(avg) => map(round)`).then(console.log).catch(console.log);

// db.where(`card => holder => person_name => filter(= 'Jane')`).get(`card => credit_limit`, `card => rate`).then(console.log).catch(console.log);

// db.where(`card => holder => person_name => filter(='Jane')`).set(`rate = 55`, `credit_limit = 50`).then(console.log).catch(console.log);

// db.getSchema().then(console.log).catch(console.log);

// db.where(`card => holder => campaign_name => filter(= 'Hot Shot')`).get(`card => number => credit_limit => reduce(sum) => reduce(avg) => map(round)`).then(console.log).catch(console.log);

// db.where(`card => credit_limit => filter(> 2000) && card => rate => filter(< 15)`).get(`card => holder => person_name`).then(console.log).catch(console.log);

// db.where(`card => credit_limit => filter(> 2000) || card => rate => filter(< 15)`).get(`card => holder => person_name`, `card => holder => city`).then(console.log).catch(console.log);

// db.define(`test1: d1 -> d2`, `test2: d2 -> integer`, `test3: d3 -> d4`).then(console.log).catch(console.log);

// db.add(`participation`).set(`_by_ = 1`, `_in_ = 1`).then(console.log).catch(console.log);

// db.add(`participation`).set(`_by_ = 3`, `_in_ = 1`).then(console.log).catch(console.log);

// db.add(`participation`).set(`_by_ = 4`, `_in_ = 2`).then(console.log).catch(console.log);

// db.where(`participation`).get(`participation => _by_`).then(console.log).catch(console.log);

// db.where('customer').get('customer => person_name').then(console.log).catch(console.log);

// db.where('card => credit_limit => filter(> 1000)').get('card => rate => filter(> 13)').then(console.log).catch(console.log);




