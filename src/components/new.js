const Data = [
  {
    image: "https://unsplash.it/640/425?image=30",
    firstname: "stephen",
    lastname: "dada",
    course: "SE",
    position: "President",
  },
  {
    image: "https://unsplash.it/640/425?image=40",
    firstname: "victor",
    lastname: "fagbohun",
    course: "CS",
    position: "President",
  },
  {
    image: "https://unsplash.it/640/425?image=50",
    firstname: "taiwo",
    lastname: "ariyo",
    course: "CS",
    position: "President",
  },
  {
    image: "https://unsplash.it/640/425?image=10",
    firstname: "praise",
    lastname: "ibe",
    course: "CS",
    position: "Vice President",
  },
  {
    image: "https://unsplash.it/640/425?image=20",
    firstname: "iyunade",
    lastname: "victor",
    course: "CS",
    position: "Vice President",
  },
  {
    image: "https://unsplash.it/640/425?image=60",
    firstname: "boye",
    lastname: "odafe",
    course: "CS",
    position: "Vice President",
  },
];


const groupedCandidates = Data.reduce((acc, candidate) => {
  const { position } = candidate;
  if (acc[position]) {
    acc[position].push(candidate);
  } else {
    acc[position] = [candidate];
  }
  return acc;
}, {});
console.log(groupedCandidates.President);

const sections = Object.entries(groupedCandidates).map(
  ([position, candidates]) => ({
    title: position,
    data: candidates,
  })
);
console.log(sections);