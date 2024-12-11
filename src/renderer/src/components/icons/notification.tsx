type propTypes = {
  size?: number
  color?: string
  status?: 'default' | 'update-available' | 'update-downloading' | 'update-downloaded'
}

const NotificationIcon = ({ size = 24, color = '#8150ab', status = 'default' }: propTypes) => {
  let fillColor = color

  switch (status) {
    case 'update-available':
      fillColor = 'orange'
      break
    case 'update-downloading':
      fillColor = 'blue'
      break
    case 'update-downloaded':
      fillColor = 'green'
      break
    default:
      fillColor = color
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.67964 8.79403C6.05382 5.49085 8.77095 3 12 3C15.2291 3 17.9462 5.49085 18.3204 8.79403L18.6652 11.8385C18.7509 12.595 19.0575 13.3069 19.5445 13.88C20.5779 15.0964 19.7392 17 18.1699 17H5.83014C4.26081 17 3.42209 15.0964 4.45549 13.88C4.94246 13.3069 5.24906 12.595 5.33476 11.8385L5.67964 8.79403Z"
        stroke={fillColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M15 19C14.5633 20.1652 13.385 21 12 21C10.615 21 9.43668 20.1652 9 19"
        stroke={fillColor}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default NotificationIcon
