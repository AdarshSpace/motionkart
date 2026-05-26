import { UploadCloud } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateCourseInput } from "./create_course";

type Props = {
  thumbnail: File | null;
  handleThumbnailChange : (file: File  | null) => void;
  register: UseFormRegister<CreateCourseInput>;
  errors: FieldErrors<CreateCourseInput>;
};



const Body = ({ thumbnail,  handleThumbnailChange, register, errors }: Props) => {

  

  return (
    <div>
         {/* Body */}
         <div className="overflow-y-auto px-6 py-6 scrollbar-hide">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Course Title
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder="Enter course title"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0039a6]"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Description
              </label>
              <textarea
                rows={3}
                {...register("description")}
                placeholder="Write course description..."
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0039a6]"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Category
              </label>
              <input
                type="text"
                {...register("category")}
                placeholder="Web Development"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0039a6]"
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            {/* Price Row */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Price
                </label>
                <input
                  type="number"
                  {...register("price")}
                  placeholder="999"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0039a6]"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Old Price
                </label>
                <input
                  type="number"
                  {...register("oldPrice")}
                  placeholder="1999"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0039a6]"
                />
                {errors.oldPrice && <p className="text-red-500 text-sm">{errors.oldPrice.message}</p>}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Thumbnail
              </label>

              <label className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:bg-slate-100">
                <UploadCloud className="mb-3 h-8 w-8 text-[#0039a6]" />

                <span className="font-medium text-slate-800">
                  Click to upload
                </span>

                <span className="mt-1 text-sm text-gray-500">
                  PNG, JPG, WEBP
                </span>
                
                {thumbnail && (
                <p className="mt-3 text-sm text-gray-600">
                  {thumbnail.name}
                </p>
              )}

                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.webp,.avif"
                  onChange={(e) => handleThumbnailChange(e.target.files?.[0] ?? null)}                                      
                />
              </label>

              {errors.root?.message && ( <p className="text-red-500 text-sm"> {errors.root.message}</p> )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default Body;