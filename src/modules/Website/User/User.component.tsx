'use client';

import UserMobilePage from './UserMobile.component';
import UserWebPage from './UserWeb.component';
import useUser from './useUser';

const UserPage = () => {
  const hooks = useUser();

  return (
    <div>
      {hooks.isDekstop ? <UserWebPage {...hooks} /> : <UserMobilePage {...hooks} />}
    </div>
  );
};

export default UserPage;