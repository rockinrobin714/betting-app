const sendQuery = require("./utils/send-query");
const GET_ALL_PEOPLE = `
  query {
    allPeople(_size: 10000) {
      data {
        _id
        name
      }
    }
    allBets(_size: 10000) {
      data {
        wins
        _id
        person
        date
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
    body: JSON.stringify({
      people: data.allPeople.data,
      bets: data.allBets.data,
    }),
  };
};
