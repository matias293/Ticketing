import { useEffect } from 'react';
import Router from 'next/router';

import UserRequest from '../../hooks/user-request';

const Signout =  () => {
  const { doRequest } = UserRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSucces:() => Router.push('/')
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <h1> Signin you out...</h1>;
};

export default Signout;
