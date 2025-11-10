export const inputOnChange = (stateSetterFunc) => {
  return (e) => {
    const { name,value } = e.target;
    stateSetterFunc((prev) =>({
      ...prev,
      [name]:value,
    }));
  };
};