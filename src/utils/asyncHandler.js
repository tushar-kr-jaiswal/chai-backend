// 1) -- const asyncHandler =  () => {};

// 2) -- const asyncHandler =  (fn) => {
// ()=>{
// }};

// 3) -- const asyncHandler =  (fn) => async () => {};

// Approach 1 --
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) =>
            next(err)
        );
    };
};

// Approach 2 --

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

export { asyncHandler };
