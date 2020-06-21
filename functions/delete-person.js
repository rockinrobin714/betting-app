const sendQuery = require("./utils/send-query");
const DELETE_PERSON = `
  mutation($id: ID!) {
    deletePerson(id: $id) {
      _id
    }
  }
`;

exports.handler = async (event) => {
  const { id } = JSON.parse(event.body);
  const { data, errors } = await sendQuery(DELETE_PERSON, { id });
  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ deletedPerson: data.deletePerson }),
  };
};
