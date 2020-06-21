const sendQuery = require("./utils/send-query");
const GET_ALL_PEOPLE = `
  query {
    allPeople {
      data {
        _id
        name
      }
    }
  }
`;

exports.handler = async () => {
  const { data, errors } = await sendQuery(GET_ALL_PEOPLE);
  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ people: data.allPeople.data }),
  };
};
