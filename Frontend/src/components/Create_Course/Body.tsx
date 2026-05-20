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
              <label className="mb-2 block text-sm font-semibold text-[#2E1065]">
                Course Title
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder="Enter course title"
                className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none transition focus:border-purple-600"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2E1065]">
                Description
              </label>
              <textarea
                rows={3}
                {...register("description")}
                placeholder="Write course description..."
                className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none transition focus:border-purple-600"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2E1065]">
                Category
              </label>
              <input
                type="text"
                {...register("category")}
                placeholder="Web Development"
                className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none transition focus:border-purple-600"
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            {/* Price Row */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2E1065]">
                  Price
                </label>
                <input
                  type="number"
                  {...register("price")}
                  placeholder="999"
                  className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none transition focus:border-purple-600"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2E1065]">
                  Old Price
                </label>
                <input
                  type="number"
                  {...register("oldPrice")}
                  placeholder="1999"
                  className="w-full rounded-2xl border border-purple-200 px-4 py-3 outline-none transition focus:border-purple-600"
                />
                {errors.oldPrice && <p className="text-red-500 text-sm">{errors.oldPrice.message}</p>}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2E1065]">
                Thumbnail
              </label>

              <label className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-200 bg-[#F8F5FF] transition hover:bg-purple-50">
                <UploadCloud className="mb-3 h-8 w-8 text-purple-700" />

                <span className="font-medium text-[#2E1065]">
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