const sendQuery = require("./utils/send-query");
const DELETE_BET = `
  mutation($id: ID!) {
    deleteBet(id: $id) {
      _id
    }
  }
`;

exports.handler = async (event) => {
  const { id } = JSON.parse(event.body);
  const { data, errors } = await sendQuery(DELETE_BET, { id });
  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ deletedBet: data.deleteBet }),
  };
};
