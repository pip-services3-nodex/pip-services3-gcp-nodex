/** @module services */
import { GoogleFunctionAction } from './GoogleFunctionAction';
/**
 * An interface that allows to integrate Google Function services into Google Function containers
 * and connect their actions to the function calls.
 */
export interface IGoogleFunctionService {
    /**
     * Get all actions supported by the service.
     * @returns an array with supported actions.
     */
    getActions(): GoogleFunctionAction[];
}
