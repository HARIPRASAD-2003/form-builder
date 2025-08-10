import { FormField } from '../redux/formSlice';

export function hasAnyCycle(fields: FormField[]): boolean {
    const visited = new Set<string>();
    const stack = new Set<string>();

    function dfs(fieldId: string): boolean {
        if (!fieldId) return false;
        if (stack.has(fieldId)) return true; // cycle found
        if (visited.has(fieldId)) return false;

        visited.add(fieldId);
        stack.add(fieldId);

        const field = fields.find(f => f.id === fieldId);
        if (field?.parentFields?.length) {
            for (const parentId of field.parentFields) {
                if (dfs(parentId)) return true;
            }
        }

        stack.delete(fieldId);
        return false;
    }

    // check for cycles starting from each field
    for (const field of fields) {
        if (dfs(field.id)) {
            return true;
        }
    }
    return false;
}