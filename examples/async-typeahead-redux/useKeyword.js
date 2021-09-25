import { useForm, useField } from "react-final-form";
import { propOr } from "ramda";

const useKeyword = (name) => {
  const {
    mutators: { setFieldData },
  } = useForm();
  const { meta } = useField(name, { subscription: { data: true } });

  return {
    keyword: propOr(null, "keyword", meta.data),
    updateKeyword: (keyword) => setFieldData(name, { keyword }),
  };
};

export default useKeyword;
