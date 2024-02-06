import { useTheme } from "../../../context/userContext";

const EmailSvg = () => {
  const { theme } = useTheme();
  return (
    <>
      <svg
        width="16"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Group">
          <path
            id="Exclude"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.1162 0.833252C14.2337 0.833252 15.3087 1.27492 16.0995 2.06742C16.8912 2.85825 17.3337 3.92492 17.3337 5.04159V11.6249C17.3337 13.9499 15.442 15.8333 13.1162 15.8333H4.88367C2.55783 15.8333 0.667 13.9499 0.667 11.6249V5.04159C0.667 2.71659 2.5495 0.833252 4.88367 0.833252H13.1162ZM14.442 6.28325L14.5087 6.21659C14.7078 5.97492 14.7078 5.62492 14.4995 5.38325C14.3837 5.25909 14.2245 5.18325 14.0587 5.16659C13.8837 5.15742 13.717 5.21659 13.5912 5.33325L9.83367 8.33325C9.35033 8.73409 8.65783 8.73409 8.167 8.33325L4.417 5.33325C4.15783 5.14159 3.7995 5.16659 3.58367 5.39159C3.35867 5.61659 3.33367 5.97492 3.5245 6.22492L3.63367 6.33325L7.42533 9.29158C7.892 9.65825 8.45783 9.85825 9.05033 9.85825C9.64117 9.85825 10.217 9.65825 10.6828 9.29158L14.442 6.28325Z"
            fill={theme === "dark" ? "black" : "#9E9E9E"}
          />
        </g>
      </svg>
    </>
  );
};

export default EmailSvg;