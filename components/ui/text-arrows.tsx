import { HiOutlineArrowUpRight } from 'react-icons/hi2'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

// 글자 옆에 붙는 화살표 아이콘. 크기는 주변 글자를 따른다
export const ArrowRight = () => <IoIosArrowForward className="text-arrow" aria-hidden="true" />
export const ArrowBack = () => <IoIosArrowBack className="text-arrow text-arrow--back" aria-hidden="true" />
export const ArrowOut = () => <HiOutlineArrowUpRight className="text-arrow" aria-hidden="true" />
