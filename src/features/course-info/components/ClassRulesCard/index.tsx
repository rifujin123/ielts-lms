import React from 'react'
import type { ClassRule } from '../../types'

interface ClassRulesCardProps {
  rules: ClassRule[]
}

export const ClassRulesCard: React.FC<ClassRulesCardProps> = ({ rules }) => {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-2xl">gavel</span>
        <h3 className="text-headline-sm font-bold text-on-surface">
          Nội quy & Trách nhiệm lớp học
        </h3>
      </div>
      <p className="mt-1 text-body-sm text-secondary">
        Học viên tuân thủ các quy định dưới đây để đảm bảo chất lượng tiếp thu và tiến độ của cả
        lớp.
      </p>

      {/* Grid of 4 rules */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {rules.map((rule) => (
          <div
            key={rule.order}
            className="flex gap-3.5 rounded-xl border border-outline-variant bg-surface-container-low p-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-label-md font-bold text-on-primary">
              {rule.order}
            </div>
            <div>
              <h4 className="text-body-md font-bold text-on-surface">{rule.title}</h4>
              <p className="mt-1 text-body-sm text-secondary leading-relaxed">{rule.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Amber warning banner */}
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
        <span className="material-symbols-outlined text-amber-600 text-xl shrink-0 mt-0.5">
          warning
        </span>
        <div className="text-body-sm leading-relaxed">
          <span className="font-bold">Lưu ý quan trọng: </span>
          Học viên vắng mặt quá 3 buổi học không phép trong một giai đoạn sẽ không đủ điều kiện tham
          gia kỳ thi Final Test cuối khóa và không được cấp chứng nhận hoàn thành khóa học từ DOL
          English.
        </div>
      </div>
    </div>
  )
}
