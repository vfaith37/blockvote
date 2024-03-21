import axios from 'axios';

const createElection = async () => {
  try {
    const response = await axios.post(
      "https://blockvote-ql92.onrender.com/api/election/createElection",
      {
        name: "BUCC",
        type: "Departmental",
        from: "Sun Mar 10 2023 01:49:32 GMT+0530",
        to: "Mon Mar 11 2023 01:49:32 GMT+0530",
        description: "Vote you",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

createElection();
