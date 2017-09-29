import React from 'react';
import Moment from 'react-moment';

const dateFormat = 'ddd MMM D Y HH:mm:ss [GMT]ZZ (z)';

export default passedProps => {
  const props = {
    ...passedProps,
  };

  return <Moment {...props} />;
};
