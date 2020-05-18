import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { IS_LOGGED_IN } from "../../graphql/queries";

// export default ({ component: Component, ...otherPages }) => {
//   const {data, loading, error} = useQuery(IS_LOGGED_IN);
//   if (loading || error || !data) {
//     return null;
//   } else if (data.isLoggedIn) {
//     return <Component {...otherProps} />
//   } else {
//     return null;
//   }
// };

export default ({ component: Component, ...rest }) => {
  const { data, loading, error } = useQuery(IS_LOGGED_IN);
  if (loading || error || !data) {
    return null;
  } else if (data.isLoggedIn) {
    return Component ? <Component {...rest} /> : rest.children;
  } else {
    return null;
  }
};
