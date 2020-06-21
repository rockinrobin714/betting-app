import React from "react";
import { Link } from "gatsby";

const Profile = () => {
  return (
    <div className="dashboard-header">
      <nav>
        <Link to="/dashboard/secret" activeClassName="active">
          Secret sstuff
        </Link>
        <Link to="/dashboard/base" activeClassName="active">
          See your base
        </Link>
      </nav>
      <span>TODO show loging status</span>
    </div>
  );
};

export default Profile;
