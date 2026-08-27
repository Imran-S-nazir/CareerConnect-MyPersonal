/**
 * Returns the appropriate dashboard route based on user type.
 * @param {string} userType - "student" | "fresher" | "professional"
 * @returns {string} - Dashboard path or fallback to select-role
 */
export const getDashboardPath = (userType) => {
  switch (userType) {
    case "student":
      return "/student/dashboard";

    case "fresher":
      return "/fresher/dashboard";

    case "professional":
      return "/professional/dashboard";

    default:
      return "/select-role";
  }
};

export default getDashboardPath;
