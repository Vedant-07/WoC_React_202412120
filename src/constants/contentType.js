export const contentType = (id) => {
  switch (id) {
    case 75:
    case 76:
      return "text/x-c";
    case 62:
      return "text/x-java-source";
    case 63:
      return "text/javascript";
    case 70:
      return "text/x-python";
    default:
      return "text/plain";
  }
};
