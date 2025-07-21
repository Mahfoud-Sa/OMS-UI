'use client'

import { Icons } from '@/components/icons/icons'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
// import { Class, Stage } from '@/types'
import { Button } from '@renderer/components/ui/button'
import { RefreshCcw, Search } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

type filterPrams = {
  class: string
  stage: string
}

const Filter = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // const { data } = useQuery<Stage[]>({
  //   queryKey: ['stages'],
  //   queryFn: () => getApi('/stage')
  // })
  // const { data: allClassData } = useQuery<Class[]>({
  //   queryKey: ['class'],
  //   queryFn: async () => {
  //     const response = await getApi('/class')
  //     return response.data
  //   }
  // })

  const [filterData, setFilterData] = useState<filterPrams>({
    class: '',
    stage: ''
  })
  // const [classData, setClassData] = useState<Class[] | undefined>([])

  // const handleStageChange = (value: string) => {
  //   setFilterData({ class: '', stage: value })
  //   setClassData(allClassData?.filter((d) => d.stageId.toString() === value))
  // }

  // useEffect(() => {
  //     replace(pathname);
  //     setSearchParams(filterData);
  // }, [filterData]);

  // useEffect(() => {
  //     replace(pathname);
  // }, []);

  const setSearchParamsFunc = (paramsData: filterPrams) => {
    const params = new URLSearchParams(searchParams.toString())

    for (const [key, value] of Object.entries(paramsData)) {
      if (value != '') {
        if (key != 'stage') {
          params.set(key, value)
        }
      }
    }

    navigate(`${location.pathname}?${decodeURIComponent(params.toString())}`)
  }

  const handelClickFilter = () => {
    setSearchParamsFunc(filterData)
  }

  const handelClickReformat = () => {
    setFilterData({ class: '', stage: '' })

    const params = new URLSearchParams(searchParams.toString())

    params.delete('class')
    // params.delete("stage")

    navigate(`${location.pathname}?${decodeURIComponent(params.toString())}`)
  }

  return (
    <Sheet onOpenChange={() => setFilterData({ class: '', stage: '' })}>
      <SheetTrigger className="w-[109px] border border-[#ACB63B] bg-white text-sm font-normal text-[#ACB63B] rounded-lg  h-[47px] flex justify-center items-center gap-1">
        فلترة
        <Icons.setting size={16} color="#ACB63B" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="!text-right mt-6">
          <SheetTitle className=" flex items-center gap-2  text-2xl text-[#ACB63B]">
            فلترة
            <Icons.setting size={28} color="#ACB63B" />
          </SheetTitle>

          <div className="mt-4">
            <div className="mt-2">
              <Select
              // onValueChange={(value) => handleStageChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="المرحلة الدراسية" />
                </SelectTrigger>
                <SelectContent>
                  {/* {data?.map(({ id, name }) => (
                    <SelectItem value={id.toString()} key={id}>
                      {name}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-2">
              <Select
                disabled={filterData.stage.length == 0}
                onValueChange={(value) => setFilterData({ ...filterData, class: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="الصف دراسي" />
                </SelectTrigger>
                <SelectContent>
                  {/* {classData?.map((el) => (
                    <SelectItem value={el.id.toString()} key={el.id}>
                      {el.name}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button
                onClick={() => handelClickFilter()}
                className="flex gap-2 items-center rounded-xl"
                size={'lg'}
              >
                <Search size={17} />
                بحث
              </Button>
              <Button
                className="flex gap-2 items-center rounded-xl bg-[#ACB63B] "
                size={'lg'}
                onClick={() => handelClickReformat()}
              >
                إعادة التهيئة
                <RefreshCcw size={17} />
              </Button>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default Filter
