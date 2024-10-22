import { useForm } from "react-hook-form";
import {
  FormData,
  experienceRateTypes,
  FormSelectFieldItem,
} from "@/lib/types";
import { FormInputField, FormSelectOptionField } from "./FormField";
import FeedbackTypeStep from "./FeedbackTypeStep";
import CompanyInfosStep from "./CompanyInfosStep";
import JobInfosStep from "./JobInfosStep";

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  //   const handleSelect = (value: validWorkingTypes) => {
  //     // Set the form value for "workingType" and mark it as dirty for validation
  //     setValue("workingType", value);
  //     setSelected(value);
  //   };

  const onSubmit = async (data: FormData) => {
    console.log("SUCCESS", data);
  };

  const experienceRate: FormSelectFieldItem = {
    name: "experienceRate",
    label: "Experience rate",
    error: errors.experienceRate,
    types: experienceRateTypes,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-blue-400">
      <div className="grid col-auto">
        <h1 className="text-3xl font-bold mb-4">Feedback Form</h1>
        <h1 className="text-xl font-bold mb-4">step 1</h1>
        <FeedbackTypeStep
          register={register}
          errors={errors}
          setValue={setValue}
        ></FeedbackTypeStep>
        <h1 className="text-xl font-bold mb-4">step 2</h1>
        <CompanyInfosStep
          register={register}
          errors={errors}
        ></CompanyInfosStep>
        <h1 className="text-xl font-bold mb-4">step 3</h1>
        <JobInfosStep
          register={register}
          errors={errors}
          setValue={setValue}
        ></JobInfosStep>
        <h1 className="text-xl font-bold mb-4">step 4</h1>
        <FormSelectOptionField
          name={experienceRate.name}
          label={experienceRate.label}
          register={register}
          error={experienceRate.error}
          setValue={setValue}
          types={experienceRate.types}
        ></FormSelectOptionField>
        <FormInputField
          type="text"
          placeholder="Feedback comment"
          name="feedbackComment"
          register={register}
          error={errors.feedbackComment}
        />
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default Form;
