const CurrentYear = async () => {
  "use cache";
  return <>{new Date().getFullYear()}</>;
};

export default CurrentYear;
