import { Plus, X } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { cn } from '../../lib/utils'
type Props = {
  className?: string
  inputId: string
  onChange?: (files: HTMLInputElement['files']) => void
  setValue: UseFormSetValue<any>
  fieldName?: string
  defaultImage: string
}

const ProfileUploader = ({
  className,
  inputId,
  setValue,
  fieldName = inputId,
  onChange,
  defaultImage
}: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null>(null)

  const handelChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    let files = null
    if (event.target.files && event.target.files[0]) {
      files = event?.target?.files
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(files[0])
    } else {
      setPreviewUrl(null)
      setValue(fieldName, undefined)
    }

    onChange?.(files)
  }

  const handelRemoveImg = () => {
    setPreviewUrl(null)
    setValue(fieldName, undefined)
  }
  return (
    <div className={cn('relative ', className)}>
      <div className="h-full w-full">
        {previewUrl ? (
          <span
            onClick={() => handelRemoveImg()}
            className=" absolute right-0 top-0 cursor-pointer bg-primary text-white"
          >
            <X />
          </span>
        ) : (
          <label
            htmlFor={inputId}
            className=" absolute right-0 top-0 cursor-pointer bg-primary text-white"
          >
            <Plus />
            <input
              id={inputId}
              accept=".jpg, .jpeg, .png"
              onChange={(event) => handelChangeInput(event)}
              type="file"
              className="hidden"
            />
          </label>
        )}
        <img
          className="h-full w-full rounded object-fill"
          src={previewUrl?.toString() ?? defaultImage}
          alt="profile img"
        />
      </div>
    </div>
  )
}

export default ProfileUploader
