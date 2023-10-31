import React, { useEffect, useState } from "react";
import CastsModal from "../../../components/Modals/CastsModal";
import Sidebar from "../Sidebar";
import { Input, Message, Select } from "../../../components/UsedInputs";
import Uploader from "../../../components/Uploader";
import { FiDelete, FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { movieValidation } from "../../../components/Validation/MovieValidation";
import {
   createMovieAction,
   getMovieByIdAction,
   removeCastAction,
   updateCastAction,
   updateMovieAction,
} from "../../../redux/Actions/MoviesActions";
import Loader from "../../../components/Notifications/Loader";

const EditMovie = () => {
   const sameClass = "w-full gap-6 flex-colo min-h-screen";
   const [modalOpen, setModalOpen] = useState(false);
   const [cast, setCast] = useState(null);
   const [imageWithoutTitle, setImageWithoutTitle] = useState("");
   const [imageTitle, setImageTitle] = useState("");
   const [videoUrl, setVideoUrl] = useState("");

   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { id } = useParams();
   //use selectors

   const { categories } = useSelector((state) => state.categoryGetAll);

   const { isLoading, isError, movie } = useSelector(
      (state) => state.getMovieById
   );
   const {
      isLoading: editLoading,
      isError: editError,
      isSuccess,
   } = useSelector((state) => state.updateMovie);

   const { casts } = useSelector((state) => state.casts);

   //validate movie

   const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
   } = useForm({
      resolver: yupResolver(movieValidation),
   });

   //onSubmit
   const onSubmit = (data) => {
      dispatch(
         updateMovieAction(movie?._id, {
            ...data,
            image: imageWithoutTitle,
            titleImage: imageTitle,
            video: videoUrl,
            casts: casts.length > 0 ? casts : movie?.casts,
         })
      );
   };

   //delete cast handler

   const deleteCastHandler = (id) => {
      dispatch(removeCastAction(id));
      toast.success("Cast deleted successfully");
   };

   //useEffect
   useEffect(() => {
      if (movie?._id !== id) {
         dispatch(getMovieByIdAction(id));
      } else {
         setValue("name", movie?.name);
         setValue("time", movie?.time);
         setValue("language", movie?.language);
         setValue("year", movie?.year);
         setValue("category", movie?.category);
         setValue("desc", movie?.desc);
         setImageWithoutTitle(movie?.image);
         setImageTitle(movie?.titleImage);
         setVideoUrl(movie?.video);
      }
      if (modalOpen === false) {
         setCast();
      }
      if (isSuccess) {
         dispatch({ type: "UPDATE_MOVIE_RESET" });
         navigate(`/edit/${id}`);
      }
      //if error show it
      if (editError) {
         toast.error("Something went wrong");
         dispatch({ type: "UPDATE_MOVIE_RESET" });
      }
   }, [
      dispatch,
      id,
      movie,
      modalOpen,
      setValue,
      isSuccess,
      editError,
      navigate,
   ]);
   return (
      <Sidebar>
         <CastsModal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            cast={cast}
         />
         {isLoading ? (
            <div className={sameClass}>
               <Loader />
            </div>
         ) : isError ? (
            <div className={sameClass}>
               <div className='flex-colo w-24 p-5 rounded-full bg-dry text-subMain text-4xl mb-4'>
                  <RiMovie2Line />
               </div>
               <p className='text-border text-sm'>Something went wrong</p>
            </div>
         ) : (
            <form
               onSubmit={handleSubmit(onSubmit)}
               className='flex flex-col gap-6'
            >
               <h2 className='text-xl font-bold'>Edit "{movie?.name}"</h2>
               <div className='w-full grid md:grid-cols-2 gap-6'>
                  <div className='w-full'>
                     <Input
                        label='Movie Title'
                        placeholder='Game Of Thrones'
                        type='text'
                        bg={true}
                        name='name'
                        register={register("name")}
                     />
                     {errors.name && <InlineError text={errors.name.message} />}
                  </div>
                  <div className='w-full'>
                     <Input
                        label='Hours'
                        placeholder='2hr'
                        type='text'
                        bg={true}
                        name='time'
                        register={register("time")}
                     />
                     {errors.time && <InlineError text={errors.time.message} />}
                  </div>
               </div>
               <div className='w-full grid md:grid-cols-2 gap-6'>
                  <div className='w-full'>
                     <Input
                        label='Language Used'
                        placeholder='English'
                        type='text'
                        bg={true}
                        name='language'
                        register={register("language")}
                     />
                     {errors.language && (
                        <InlineError text={errors.language.message} />
                     )}
                  </div>
                  <div className='w-full'>
                     <Input
                        label='Year Of Release'
                        placeholder='2023'
                        type='number'
                        bg={true}
                        name='year'
                        register={register("year")}
                     />
                     {errors.year && <InlineError text={errors.year.message} />}
                  </div>
               </div>
               <div className='w-full grid md:grid-cols-2 gap-6'>
                  <div className='flex flex-col gap-2'>
                     <p className='text-border font-semibold text-sm'>
                        Image without Title
                     </p>
                     <Uploader setImageUrl={setImageWithoutTitle} />
                     <ImagePreview
                        image={imageWithoutTitle}
                        name='imagewithoutTitle'
                     />
                  </div>
               </div>
               <div className='flex flex-col gap-2'>
                  <p className='text-border font-semibold text-sm'>
                     Image with Title
                  </p>
                  <Uploader setImageUrl={setImageTitle} />
                  <ImagePreview
                     image={imageTitle}
                     name='imageTitle'
                  />
               </div>
               <div className='w-full'>
                  <Message
                     label='Movie Description'
                     placeholder='Make it short and sweet'
                     name='desc'
                     register={{ ...register("desc") }}
                  />
                  {errors.desc && <InlineError text={errors.desc.message} />}
               </div>
               <div className='text-sm w-full'>
                  <Select
                     label='Movie Category'
                     options={categories?.length > 0 ? categories : []}
                     name='category'
                     register={{ ...register("category") }}
                  />
                  {errors.category && (
                     <InlineError text={errors.category.message} />
                  )}
               </div>
               {/* movie video */}

               <div className='flex flex-col gap-2 w-full'>
                  <p className='text-border font-semibold text-sm'>
                     Movie Video
                  </p>
                  <div
                     className={`w-full grid ${
                        videoUrl && "md:grid-cols-2"
                     } gap-6`}
                  >
                     {videoUrl && (
                        <div className='w-full bg-main text-sm text-subMain py-4 border border-border rounded flex-colo'>
                           Video Uploaded
                        </div>
                     )}
                     <Uploader setImageUrl={setVideoUrl} />
                  </div>
               </div>

               <div className='w-full grid lg:grid-cols-2 gap-6 items-start'>
                  <button
                     onClick={() => setModalOpen(true)}
                     className='w-full py-4 bg-main border border-subMain border-dashed text-white rounded'
                  >
                     Add Cast
                  </button>
                  <div className='grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-4 grid-cols-2 gap-4'>
                     {casts?.length > 0 &&
                        casts.map((user) => (
                           <div
                              key={user.id}
                              className='p-2 italic text-xs text-text rounded flex-colo bg-main border border-border'
                           >
                              <img
                                 src={`${user?.image ? user.image : ""}`}
                                 alt={user.name}
                                 className='w-full h-24 object-cover rounded mb-2'
                              />
                              <p>{user.name}</p>
                              <div className='flex-rows mt-2 w-full gap-2'>
                                 <button
                                    onClick={() => deleteCastHandler(user?.id)}
                                    className='w-6 h-6 bg-dry border border-border text-subMain rounded flex-colo'
                                 >
                                    <FiDelete />
                                 </button>
                                 <button
                                    onClick={() => setCast(user)}
                                    className='w-6 h-6 bg-dry border border-border  rounded flex-colo'
                                 >
                                    <FaEdit />
                                 </button>
                              </div>
                           </div>
                        ))}
                  </div>
               </div>
               <div className='flex justify-end items-center my-4'>
                  <button
                     disabled={isLoading}
                     type='submit'
                     className='bg-subMain transitions hover:bg-main border border-subMain font-medium text-white py-4 rounded w-full sm:w-auto'
                  >
                     {isLoading ? (
                        "Updating..."
                     ) : (
                        <>
                           <FiUpload /> Publish Movie
                        </>
                     )}
                  </button>
               </div>
            </form>
         )}
      </Sidebar>
   );
};

export default EditMovie;
