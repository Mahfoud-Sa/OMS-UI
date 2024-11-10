import { ChevronRightCircleIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

type PropsType = {
  href: string
  size?: number
  color?: string
}

const BackBtn = ({ href, color = '#171717', size = 40 }: PropsType) => {
  return (
    <Link to={href}>
      <ChevronRightCircleIcon color={color} size={size} />
    </Link>
  )
}

export default BackBtn
