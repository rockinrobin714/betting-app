const sendQuery = require("./utils/send-query");

const EDIT_BET = `
  mutation($id: ID!, $wins: [String]!, $date: String!, $person: String!) {
    updateBet(id: $id, data: { wins: $wins, date: $date, person: $person }) {
      _id
    }
  }
`;

exports.handler = async (event) => {
  const { id, wins, date, person } = JSON.parse(event.body);
  const { data, errors } = await sendQuery(EDIT_BET, {
    id,
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
    body: JSON.stringify({ updatedBet: data.updateBet }),
  };
};
