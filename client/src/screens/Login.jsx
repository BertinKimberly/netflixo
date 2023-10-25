import React, { useEffect } from "react";
import { Input } from "../components/UsedInputs";
import Layout from "../Layout/Layout";
import { FaUserCheck } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { LoginValidation } from "../components/Validation/UserValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

const Login = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { isLoading, isError, userInfo, isSuccess } = useSelector(
      (state) => state.userLogin
   );

   //validate user

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm({
      resolver: yupResolver(LoginValidation),
   });

   //onSubmit
   const onSubmit = (data) => {
      dispatch(loginAction(data));
   };




//useEffect
   useEffect(() => {
      if (userInfo.isAdmin) {
         navigate("/dashboard");
      } else if (userInfo) {
         navigate("/profile");
      }
      if (isSuccess) {
         toast.success(`Welcome back ${userInfo?.fullName}`);
      }
      if (isError) {
         toast.error(isError);
         dispatch({ type: "USER_LOGIN_RESET" });
      }
   }, [userInfo, isSuccess, isError, navigate, dispatch]);
   return (
      <Layout>
         <div className='container mx-auto px-2 my-24 flex-colo'>
            <form
               onSubmit={handleSubmit(onSubmit)}
               className='w-full 2xl:w-2/5 flex-colo md:w-3/5 bg-dry rounded-lg border border-border'
            >
               <h1>NETFLIXO</h1>
               <div className='w-full'>
                  <Input
                     label='Email'
                     placeholder='Enter your email'
                     type='email'
                     name='email'
                     register={register("email")}
                     bg={true}
                  />
                  {errors.email && <InlineError text={errors.email.message} />}
               </div>
               <div className='w-full'>
                  <Input
                     label='Password'
                     placeholder='Enter your password'
                     type='passwordl'
                     bg={true}
                     name='password'
                     register={register("password")}
                  />
                  {errors.email && <InlineError text={error.email.message} />}
               </div>

               <button
                  type='submit'
                  disabled={isLoading}
                  className='bg-subMain transitions hover:bg-main flex-rows gap-4 text-white p-4 rounded-lg w-full'
               >
                  {isLoading ? (
                     "Loading"
                  ) : (
                     <>
                        <FaUserCheck /> Sign In
                     </>
                  )}
               </button>
               <p className='text-center text-border'>
                  Don't have an account?{" "}
                  <Link
                     to='/register'
                     className='text-dryGray font-semibold ml-2'
                  >
                     Sign Up
                  </Link>
               </p>
            </form>
         </div>
      </Layout>
   );
};

export default Login;
