import { FilePill } from './segment-explorer'
import { cx } from '../../utils/cx'

export function SegmentSuggestion({
  possibleExtension,
  missingBoundaryTypes,
  isExpanded,
}: {
  possibleExtension: string
  missingBoundaryTypes: string[]
  isExpanded: boolean
}) {
  return (
    <div
      className={cx(
        'segment-explorer-suggestions',
        isExpanded && 'segment-explorer-suggestions--expanded'
      )}
    >
      <p>
        This segment may be missing the following special files:
        {missingBoundaryTypes.map((type) => {
          return (
            <FilePill
              key={type}
              type={type}
              isBuiltin={true}
              isOverridden={false}
              filePath={type + '.' + possibleExtension}
              fileName={type + '.' + possibleExtension}
            />
          )
        })}
      </p>
    </div>
  )
}
