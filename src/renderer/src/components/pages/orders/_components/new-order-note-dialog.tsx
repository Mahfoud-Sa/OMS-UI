import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@renderer/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@renderer/components/ui/form'
import { Label } from '@renderer/components/ui/label'
import { Textarea } from '@renderer/components/ui/textarea'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface NewOrderNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  addDeliveryNote: (note: string) => void
  note?: string
}

const schema = z.object({
  note: z.string()
})

type FormData = z.infer<typeof schema>

const NewOrderNoteDialog: React.FC<NewOrderNoteDialogProps> = ({
  isOpen,
  onClose,
  addDeliveryNote,
  note
}) => {
  const defaultValues: FormData = {
    note: ''
  }
  React.useEffect(() => {
    if (note) {
      form.reset({ note: note })
    }
  }, [note])

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
  })

  const handleSave = (data: FormData) => {
    // Add new product
    addDeliveryNote(data.note)
    // Clear the form
    form.reset(defaultValues)
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose && onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>{'اضافة ملاحظات تسليم الطلب'}</DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <div className="flex flex-wrap mb-2 flex-col">
              <div className="my-3 grid grid-cols-1 gap-3 items-center">
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <Label>ملاحظات على تسليم الطلب</Label>
                          <Textarea
                            title="ملاحظة الطلب"
                            {...field}
                            placeholder="ملاحظات على تسليم الطلب"
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" onClick={onClose}>
                الغاء
              </Button>
              <Button onClick={form.handleSubmit(handleSave)} className="ml-2">
                {'حفظ'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewOrderNoteDialog
