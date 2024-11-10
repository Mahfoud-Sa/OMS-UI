import Loader from '@renderer/components/layouts/loader'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { PhoneInput } from '@renderer/components/ui/phone-input'
import { Textarea } from '@renderer/components/ui/textarea'
import { getApi } from '@renderer/lib/http'
import { Order } from '@renderer/types/api'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

const MainInfo = () => {
  const { id } = useParams()

  const { data, isPending, error, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getApi<Order>(`/Orders/${id}`)
  })

  if (isPending)
    return (
      <div className="flex justify-center items-center bg-white rounded-lg min-h-[800px] shadow-sm">
        <Loader size={50} color="#DA972E" />
      </div>
    )

  if (isError) return <p>{error.message}</p>

  return (
    <section className="mt-3">
      <div className="grid grid-cols-3 gap-3">
        <Input
          disabled={true}
          value={data.data.id}
          placeholder="رقم الطلب"
          martial
          label="رقم الطلب"
        />
        <Input
          disabled={true}
          value={data.data.billNo}
          placeholder="رقم الفاتورة"
          martial
          label="رقم الفاتورة"
        />
        <Input
          disabled={true}
          value={data.data.customerName}
          placeholder="اسم العميل"
          martial
          label="اسم العميل"
        />
        {/* <Input
          disabled={true}
          value={data.data.customerNo}
          placeholder="رقم العميل"
          martial
          label="رقم العميل"
        /> */}
        <PhoneInput
          value={data.data.customerNo}
          countries={['SA']}
          defaultCountry="SA"
          maxLength={16}
          className="flex-row-reverse rounded-sm"
          labels={{
            SA: 'السعودية'
          }}
          title="رقم العميل"
          placeholder="5********"
          disabled
        />
        <Input
          disabled={true}
          value={new Date(data.data.createAt).toISOString().split('T')[0]}
          placeholder="تاريخ الإنشاء"
          martial
          type="date"
          label="تاريخ الإنشاء"
        />
        <Input
          type="date"
          disabled={true}
          value={new Date(data.data.deliveryAt).toISOString().split('T')[0]}
          placeholder="تاريخ التسليم "
          martial
          label="تاريخ التسليم"
        />
        {/* TODO: this input should only appear to admin and retail user.*/}
        <Input
          disabled={true}
          value={data.data.sellingPrice}
          placeholder="سعر البيع"
          martial
          label="سعر البيع"
        />
        {/* TODO: this input should be based on user role/type/permission. its only for orders manager or admin
        and only be shown to admin.
        */}
        <Input
          disabled={true}
          value={data.data.costPrice}
          placeholder="سعر التكلفة"
          martial
          label="سعر التكلفة"
        />
        <div className="col-span-3">
          <Label className="font-bold text-base">ملاحظات</Label>
          <Textarea disabled={true} className="bg-white mt-2" rows={10}>
            {data.data.note}
          </Textarea>
        </div>
      </div>
    </section>
  )
}

export default MainInfo
