const sendQuery = require("./utils/send-query");

const ADD_BET = `
  mutation($wins: [String]!, $date: String!, $person: String!) {
    createBet(data: {wins: $wins, date: $date, person: $person}) {
      _id
    }
  }
`;

exports.handler = async (event) => {
  const { wins, date, person } = JSON.parse(event.body);
  const { data, errors } = await sendQuery(ADD_BET, {
    wins,
    date,
    person,
  });
  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ newBet: data.createBet }),
  };
};
