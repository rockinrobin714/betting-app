import React from "react";
import { Link } from "gatsby";
import { IdentityContextProvider } from "react-netlify-identity-widget";

import "./layout.css";

const Layout = ({ children }) => (
  <IdentityContextProvider>
    <header>
      <Link to="/FAMstack-intro-auth.netlify.com"> App</Link>
    </header>
    <main>{children}</main>
  </IdentityContextProvider>
);

export default Layout;
