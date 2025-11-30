print("^3WARNING: ^7Please avoid using it in PRODUCTION server.")

local visible = false

local currentDictInUse = nil

function LoadAnimDict(dict)
    -- Early Exist as Animation Dict Doesn't Exist for Game
    if not DoesAnimDictExist(dict) then
        print(`Early Exist as Animation Dict Doesn't Exist for Game`)
        return false
    end

    if not HasAnimDictLoaded(dict) then
        RequestAnimDict(dict)

        local started = GetGameTimer()
        repeat Wait(1) until HasAnimDictLoaded(dict) or (GetGameTimer() - started) > 5000

        if (GetGameTimer() - started) > 5000 then
            print('Failed to load Animation Dict in time.')
            return false
        end
    end

    if HasAnimDictLoaded(dict) then return true end

    return false
end

RegisterCommand('animdevtool', function()
    visible = true
    SendNUIMessage({
        action = 'setVisible',
        data = {
            state = visible
        }
    })

    SetNuiFocus(true, true)
    
end)

RegisterNuiCallback("animations.play-anim", function(data, cb)
    local cbData = data.data
    local animDict = cbData.dict
    local animClip = cbData.clip

    if not animDict or animDict == '' or not animClip or animClip == '' then
        print('Dict/Clip Not received')
        return cb(false)
    end

    local duration = -1
    local flags = cbData.flags or 1 -- repeat

    local blendInSpeed = cbData.blendInSpeed or 1.0
    local blendOutSpeed = cbData.blendOutSpeed or 1.0
    local playbackRate = cbData.playbackRate or 0.0
    local entity = cbData.entity ~= 0 and cbData.entity or PlayerPedId() -- Run on Self

    print(animDict, animClip, duration, flags, blendInSpeed, blendOutSpeed, playbackRate, entity)

    local animLoaded = LoadAnimDict(animDict)

    if not animLoaded then print('Failed to Load Anim Dict', animDict) return cb(false) end

    print(animLoaded)

    print('EntityExist', DoesEntityExist(entity))

    if not DoesEntityExist(entity) then
        print('Entity DoesNotExist', entity)
        RemoveAnimDict(animDict)
        return cb(false)
    end

    currentDictInUse = animDict

    TaskPlayAnim(entity, animDict, animClip, blendInSpeed, blendOutSpeed, duration, flags, playbackRate, true, 0, false, "", false)

    cb(true)
end)

RegisterNuiCallback("animations.stop-anim", function(data, cb)
    local cbData = data.data

    local entity = cbData.entity ~= 0 and cbData.entity or PlayerPedId()

    if currentDictInUse then
        RemoveAnimDict(currentDictInUse)
    end

    if not DoesEntityExist(entity) then
        print('Entity DoesNotExist', entity)
        return cb(false)
    end

    ClearPedTasks(entity)

    cb(true)
end)

RegisterNuiCallback("animations.close-anim", function(data, cb)
    SetNuiFocus(false, false)
    visible = false
    cb(true)
end)