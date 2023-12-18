type SubmitBtnProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export function SubmitBtn({ children, onClick }: SubmitBtnProps) {
  return (
    <button
      className="p-2 rounded-md border-gray-400 border-solid border-2 bg-blue-300 enabled:hover:border-blue-500 focus:border-blue-700 outline-none"
      onClick={onClick}
      type="submit"
    >
      {children}
    </button>
  );
}
