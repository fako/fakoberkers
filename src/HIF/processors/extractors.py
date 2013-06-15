import json

def extractor(target, objectives):
    # Result list to return
    results = []

    # Extract objective keys into one dict for easy lookup.
    # TODO: make this work with duplicate keys
    objective_keys = {}
    for i in range(0, len(objectives)):
        for k in objectives[i].iterkeys():
            objective_keys[k] = i

    # Recursive function to iterate over response and extract results from there.
    # TODO: make this work with duplicate keys
    def extract(target):
        # Recursively use this function when confronted with list
        if isinstance(target,list):
            for i in target:
                extract(i)
        # Extract data when confronted with dict
        elif isinstance(target, dict):
            result = {}
            for k in target.iterkeys():
                # When a key in target is an objective and there is no result yet, create default result from objective and override found key
                if k in objective_keys and not result:
                    result = dict(objectives[objective_keys[k]])
                    result[k] = target[k]
                # When a key in target is an objective and there already is result, just override default result values.
                elif k in objective_keys:
                    result[k] = target[k]
                # Recursively use self when confronted with something else then an objective
                else:
                    extract(target[k])
            if result:
                results.append(result)
        # Only return the value when not dealing with lists or dicts.
        else:
            return target

    extract(target)
    return results

def json_extractor(json_string,objectives):
    target_dict = json.loads(json_string)
    return extractor(target_dict,objectives)