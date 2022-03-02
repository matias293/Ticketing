import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSucces }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, {
        ...body,
        ...props,
      });
      if (onSucces) {
        onSucces(response.data);
      }
      return response.data;
    } catch (err) {
      setErrors(
        <div className='alert alert-danger mt-3'>
          <h4>Ooooooooppppps.......</h4>
          <ul>
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };
  return { doRequest, errors };
};
export default useRequest;
