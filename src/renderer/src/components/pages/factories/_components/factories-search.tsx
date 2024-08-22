'use client'

import AsyncSelect from 'react-select/async'
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { getApi } from "@/lib/http";
import { Search } from 'lucide-react'
import { useState } from 'react'

interface Organization {
  arabicName: string
}

const OrdersSearch = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // const pathname = usePathname();
  // const { replace } = useRouter();
  // const searchParams = useSearchParams();

  // const selectedVal = searchParams?.getAll("search");

  // const { data: organizations } = useQuery<Organization[]>({
  //   queryKey: ["organizations"],
  //   queryFn: () => getApi("/Organization"),
  // });

  // const loadOptions = async (value: string) => {
  //   if (!value) return [];
  //   const data = await getApi<Organization[]>("/Organization", {
  //     "arabicName[contains]": value,
  //   });
  //   return data || [];
  // };

  const customComponents = {
    DropdownIndicator: () => null,
    IndicatorSeparator: () => null
  }

  // const onChange = (val: { arabicName: string } | null) => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   if (val?.arabicName) {
  //     params.set("search", val.arabicName);
  //   } else {
  //     params.delete("search");
  //   }
  //   replace(`${pathname}?${params.toString()}`);
  // };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      border: 'none',
      boxShadow: 'none',
      backgroundColor: '#fff'
    }),
    input: (provided: any) => ({
      ...provided,
      margin: 0
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontWeight: 'bold',
      color: '#4B4846'
    }),
    singleValue: (provided: any) => ({
      ...provided
    })
  }

  return (
    <section className="flex w-full items-center justify-center rounded-lg border border-[#7d7875]">
      <Search className="mr-2 text-gray-500" />
      <AsyncSelect<Organization>
        placeholder="ابحث عن.."
        loadingMessage={() => 'جارٍ البحث ...'}
        noOptionsMessage={() => 'لا توجد نتائج'}
        cacheOptions
        instanceId="local-org-search"
        // value={selectedVal?.length ? { arabicName: selectedVal[0] } : undefined}
        // defaultOptions={organizations}
        // loadOptions={loadOptions}
        // onChange={onChange}
        getOptionLabel={({ arabicName }) => arabicName}
        getOptionValue={({ arabicName }) => arabicName}
        components={customComponents}
        isClearable
        menuIsOpen={isMenuOpen}
        onInputChange={(value) => {
          setIsMenuOpen(value.length > 0)
        }}
        styles={customStyles}
        className="flex-grow"
      />
    </section>
  )
}

export default OrdersSearch
