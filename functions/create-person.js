const sendQuery = require("./utils/send-query");
const CREATE_PERSON = `
  mutation($name: String!) {
    createPerson(data: {name: $name}) {
      _id
      name
    }
  }
`;

exports.handler = async (event) => {
  const { name } = JSON.parse(event.body);
  const { data, errors } = await sendQuery(CREATE_PERSON, { name });
  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ newPerson: data.createPerson }),
  };
};
