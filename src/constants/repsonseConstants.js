const StatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  CONFLICT: 409,
};

const ResponseMessages = {
  SUCCESS: 'Success',
  FAILURE: 'Something Went Wrong',
  INVALID_CREDENTIAL: 'Invalid Credential',
  INVALID_TOKEN: 'Invalid Token',
  NOT_LOGGED: 'You Are Not Logged In',
  NO_POST: 'Post Not Found',
  NO_USER: 'User Not Found',
  NO_COMMENT: 'Comment Not Found',
  SELF_FOLLOW: 'You Can Not Follow Yourself',
  ALREADY_FOLLOW: 'You Already Follow This User',
  DOESNT_FOLLOW: 'You Were Not Following This User',
  ALREADY_LIKE: 'You Already Liked This post',
  DOESNT_LIKE: 'No Like Found',
  VALIDATION: 'Validation Error',

};

module.exports = { StatusCodes, ResponseMessages };
