import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { ProductionTeam } from '@renderer/types/api'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../../../ui/dialog'

const UpdateProductionTeamDialog = ({
  editProductionTeam,
  onClose,
  productionTeam,
  openDialog = false,
  productionLineId
}: {
  editProductionTeam: (id: string, name: string, phone: string, productionLineId: string) => void
  onClose?: () => void
  productionTeam?: ProductionTeam
  openDialog?: boolean
  productionLineId: string
}) => {
  const [teamName, setTeamName] = useState('')
  const [teamPhone, setTeamPhone] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(openDialog)
  const [teamNameError, setTeamNameError] = useState('')
  const [teamPhoneError, setTeamPhoneError] = useState('')

  useEffect(() => {
    if (openDialog) {
      setIsDialogOpen(true)
    }
  }, [openDialog])

  useEffect(() => {
    if (productionTeam) {
      setTeamName(productionTeam.name)
      setTeamPhone(productionTeam.phone)
    }
  }, [productionTeam])

  const validatePhone = (phone: string) => {
    const phoneRegex = /^5\d{8}$/
    return phoneRegex.test(phone)
  }

  const handleSubmit = () => {
    let valid = true
    console.log('productionLineId', productionLineId)
    console.log('productionTeam.id', productionTeam?.id)
    console.log('teamName', teamName)
    console.log('teamPhone', teamPhone)

    if (!teamName) {
      setTeamNameError('اسم قائد الفريق مطلوب')
      valid = false
    } else {
      setTeamNameError('')
    }

    if (!teamPhone) {
      setTeamPhoneError('رقم الهاتف مطلوب')
      valid = false
    } else if (!validatePhone(teamPhone)) {
      setTeamPhoneError('رقم الهاتف يجب أن يكون 9 أرقام تبدأ بـ 5')
      valid = false
    } else {
      setTeamPhoneError('')
    }

    if (valid && productionTeam?.id) {
      console.log('productionLineId', productionLineId)
      console.log('productionTeam.id', productionTeam.id)
      console.log('teamName', teamName)
      console.log('teamPhone', teamPhone)
      editProductionTeam(productionTeam.id, teamName, teamPhone, productionLineId)
      setIsDialogOpen(false)
      onClose && onClose()
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => {
        setIsDialogOpen(false)
        onClose && onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>تحديث فريق الإنتاج</DialogHeader>
        <div>
          <div>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="اسم قائد فريق الإنتاج"
              label="اسم قائد فريق الإنتاج"
            />
            {teamNameError && <small className="text-red-500">{teamNameError}</small>}
          </div>
          <div className="my-3">
            <Input
              value={teamPhone}
              onChange={(e) => setTeamPhone(e.target.value)}
              placeholder="رقم التواصل"
              label="رقم التواصل"
              type="tel"
              maxLength={9}
              prefix="+966"
            />
            {teamPhoneError && <small className="text-red-500">{teamPhoneError}</small>}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            تحديث فريق الإنتاج
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateProductionTeamDialog
