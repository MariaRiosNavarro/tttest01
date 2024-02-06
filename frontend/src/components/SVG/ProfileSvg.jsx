const ProfileSvg = (props) => {
  return (
    <>
      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={props.selectedIcon ? "fill-primary" : ""}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.6097 15.3462C8.74213 15.3462 5.43927 15.931 5.43927 18.2729C5.43927 20.6148 8.72117 21.2205 12.6097 21.2205C16.4774 21.2205 19.7793 20.6348 19.7793 18.2938C19.7793 15.9529 16.4983 15.3462 12.6097 15.3462Z"
          stroke="#9E9E9E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={props.selectedIcon ? "stroke-primary" : ""}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.6098 12.0059C15.1479 12.0059 17.205 9.94779 17.205 7.40969C17.205 4.8716 15.1479 2.81445 12.6098 2.81445C10.0717 2.81445 8.01358 4.8716 8.01358 7.40969C8.00501 9.93922 10.0488 11.9973 12.5774 12.0059H12.6098Z"
          stroke="#9E9E9E"
          strokeWidth="1.42857"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={props.selectedIcon ? "stroke-primary" : ""}
        />
      </svg>
    </>
  );
};

export default ProfileSvg;
